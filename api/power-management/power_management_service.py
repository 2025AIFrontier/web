#!/usr/bin/env python3
"""
Windows Power Management API Service
Manages Windows power plans and monitors AC adapter status
"""

import os
import sys
import subprocess
import platform
import json
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from threading import Thread
import time
import psutil

# Flask 앱 초기화
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3001",
    "http://localhost:3002",
    "http://10.252.92.75",
    "http://aipc.sec.samsung.net"
])

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Windows 전원 계획 GUID (Windows 10/11 표준 GUID)
POWER_PLANS = {
    'powersaver': 'a1841308-3541-4fab-bc81-f71556f20b4a',  # 절전 (Power saver)
    'balanced': '381b4222-f694-41f0-9685-ff5bb260df2e',    # 균형 조정 (Balanced)
    'high': '8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c'         # 고성능 (High performance)
}

# 현재 설정 저장
current_settings = {
    'power_mode': 'standard',  # 'standard', 'optimized', 'always-high'
    'current_plan': 'balanced',
    'is_ac_connected': True
}

class PowerManager:
    """Windows 전원 관리 클래스"""
    
    def __init__(self):
        self.is_windows = platform.system() == 'Windows'
        if not self.is_windows:
            logger.warning("Non-Windows platform detected. Some features may not work.")
    
    def get_current_power_plan(self):
        """현재 활성화된 전원 계획 확인"""
        try:
            if not self.is_windows:
                return current_settings.get('current_plan', 'balanced')  # 저장된 값 또는 기본값 반환
            
            # Windows에서 powercfg 명령어로 현재 전원 계획 확인
            if platform.system() == 'Windows':
                # shell=True 사용 (Windows 호환성)
                result = subprocess.run(
                    'powercfg /GETACTIVESCHEME',
                    shell=True,
                    capture_output=True,
                    text=True,
                    check=False
                )
            else:
                result = subprocess.run(
                    ['powercfg', '/GETACTIVESCHEME'],
                    capture_output=True,
                    text=True,
                    check=False
                )
            
            if result.returncode != 0:
                logger.warning(f"Could not get power plan: {result.stderr}")
                return current_settings.get('current_plan', 'balanced')
            
            output = result.stdout.lower()
            
            # GUID로 전원 계획 확인
            for plan_name, plan_guid in POWER_PLANS.items():
                if plan_guid.lower() in output:
                    current_settings['current_plan'] = plan_name
                    return plan_name
            
            # GUID가 없으면 이름으로도 확인 (한글 Windows 등)
            if 'high performance' in output or '고성능' in output or '높은 성능' in output:
                current_settings['current_plan'] = 'high'
                return 'high'
            elif 'power saver' in output or '절전' in output or '절약' in output:
                current_settings['current_plan'] = 'powersaver'
                return 'powersaver'
            elif 'balanced' in output or '균형' in output or '균형 조정' in output:
                current_settings['current_plan'] = 'balanced'
                return 'balanced'
            
            return current_settings.get('current_plan', 'balanced')  # 저장된 값 또는 기본값
        except FileNotFoundError:
            logger.error("powercfg command not found. Make sure you're running on Windows.")
            return current_settings.get('current_plan', 'balanced')
        except Exception as e:
            logger.error(f"Failed to get current power plan: {e}")
            return current_settings.get('current_plan', 'balanced')
    
    def set_power_plan(self, plan_name):
        """전원 계획 설정"""
        try:
            if not self.is_windows:
                logger.info(f"Simulating power plan change to {plan_name} (non-Windows)")
                current_settings['current_plan'] = plan_name
                return True
            
            if plan_name not in POWER_PLANS:
                logger.error(f"Invalid power plan: {plan_name}")
                return False
            
            plan_guid = POWER_PLANS[plan_name]
            
            # Windows에서 powercfg 명령어 실행
            # shell=True를 사용하여 명령어 실행 (Windows 호환성)
            if platform.system() == 'Windows':
                cmd = f'powercfg /SETACTIVE {plan_guid}'
                result = subprocess.run(
                    cmd,
                    shell=True,
                    capture_output=True,
                    text=True,
                    check=False  # check=False로 변경하여 직접 처리
                )
                
                # 권한 오류 확인
                if result.returncode != 0:
                    if 'access denied' in result.stderr.lower() or '액세스가 거부' in result.stderr:
                        logger.error(f"Administrator privileges required. Error: {result.stderr}")
                        # 대체 방법: PowerShell 시도
                        ps_cmd = f'powershell -Command "powercfg /SETACTIVE {plan_guid}"'
                        ps_result = subprocess.run(ps_cmd, shell=True, capture_output=True, text=True)
                        if ps_result.returncode == 0:
                            current_settings['current_plan'] = plan_name
                            logger.info(f"Power plan changed to {plan_name} using PowerShell")
                            return True
                    logger.error(f"Failed to set power plan. Error: {result.stderr}")
                    return False
            else:
                # Non-Windows 시스템
                result = subprocess.run(
                    ['powercfg', '/SETACTIVE', plan_guid],
                    capture_output=True,
                    text=True,
                    check=True
                )
            
            current_settings['current_plan'] = plan_name
            logger.info(f"Power plan changed to {plan_name}")
            return True
        except FileNotFoundError:
            logger.error("powercfg command not found. Make sure you're running on Windows.")
            return False
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to set power plan: {e.stderr if e.stderr else str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error setting power plan: {e}")
            return False
    
    def is_ac_connected(self):
        """AC 어댑터 연결 상태 확인"""
        try:
            # psutil을 사용하여 배터리 정보 확인
            battery = psutil.sensors_battery()
            if battery is None:
                # 배터리 정보가 없는 경우 (데스크톱)
                return True
            return battery.power_plugged
        except Exception as e:
            logger.error(f"Failed to check AC adapter status: {e}")
            return True  # 기본값으로 전원 연결 상태 반환
    
    def get_battery_info(self):
        """배터리 정보 가져오기"""
        try:
            battery = psutil.sensors_battery()
            if battery is None:
                return None
            
            return {
                'percent': battery.percent,
                'power_plugged': battery.power_plugged,
                'time_left': battery.secsleft if battery.secsleft > 0 else None
            }
        except Exception as e:
            logger.error(f"Failed to get battery info: {e}")
            return None

# PowerManager 인스턴스 생성
power_manager = PowerManager()

def monitor_power_status():
    """백그라운드에서 전원 상태 모니터링"""
    while True:
        try:
            is_ac = power_manager.is_ac_connected()
            current_settings['is_ac_connected'] = is_ac
            
            # 최적화된 고성능 모드에서만 자동 전환
            if current_settings['power_mode'] == 'optimized':
                current_plan = power_manager.get_current_power_plan()
                
                # AC 연결 시 고성능으로, 배터리 시 균형 조정으로
                if is_ac and current_plan != 'high':
                    power_manager.set_power_plan('high')
                elif not is_ac and current_plan != 'balanced':
                    power_manager.set_power_plan('balanced')
            
            # 표준 모드: 항상 균형
            elif current_settings['power_mode'] == 'standard':
                current_plan = power_manager.get_current_power_plan()
                if current_plan != 'balanced':
                    power_manager.set_power_plan('balanced')
            
            # 항상 고성능 모드: 항상 고성능
            elif current_settings['power_mode'] == 'always-high':
                current_plan = power_manager.get_current_power_plan()
                if current_plan != 'high':
                    power_manager.set_power_plan('high')
            
            time.sleep(5)  # 5초마다 확인
        except Exception as e:
            logger.error(f"Error in power monitoring: {e}")
            time.sleep(5)

# API 엔드포인트들

@app.route('/api/power/status', methods=['GET'])
def get_power_status():
    """전원 상태 정보 제공"""
    try:
        current_plan = power_manager.get_current_power_plan()
        is_ac = power_manager.is_ac_connected()
        battery_info = power_manager.get_battery_info()
        
        return jsonify({
            'success': True,
            'currentPlan': current_plan,
            'isACConnected': is_ac,
            'powerMode': current_settings['power_mode'],
            'battery': battery_info
        })
    except Exception as e:
        logger.error(f"Error getting power status: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/power/set-plan', methods=['POST'])
def set_power_plan():
    """전원 계획 설정"""
    try:
        data = request.json
        plan = data.get('plan')
        
        if plan not in POWER_PLANS:
            return jsonify({
                'success': False,
                'error': 'Invalid power plan'
            }), 400
        
        success = power_manager.set_power_plan(plan)
        
        return jsonify({
            'success': success,
            'currentPlan': plan if success else power_manager.get_current_power_plan()
        })
    except Exception as e:
        logger.error(f"Error setting power plan: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/power/set-mode', methods=['POST'])
def set_power_mode():
    """전원 모드 설정"""
    try:
        data = request.json
        mode = data.get('mode')
        
        if mode not in ['standard', 'optimized', 'always-high']:
            return jsonify({
                'success': False,
                'error': 'Invalid power mode'
            }), 400
        
        current_settings['power_mode'] = mode
        
        # 모드에 따른 즉시 적용
        is_ac = power_manager.is_ac_connected()
        
        if mode == 'standard':
            # 표준: 항상 균형
            power_manager.set_power_plan('balanced')
        elif mode == 'optimized':
            # 최적화된 고성능: AC=고성능, 배터리=균형
            if is_ac:
                power_manager.set_power_plan('high')
            else:
                power_manager.set_power_plan('balanced')
        elif mode == 'always-high':
            # 항상 고성능
            power_manager.set_power_plan('high')
        
        return jsonify({
            'success': True,
            'powerMode': mode
        })
    except Exception as e:
        logger.error(f"Error setting power mode: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'power-management-api'})

if __name__ == '__main__':
    # 백그라운드 모니터링 스레드 시작
    monitor_thread = Thread(target=monitor_power_status, daemon=True)
    monitor_thread.start()
    
    # Flask 앱 실행
    port = int(os.environ.get('PORT', 3012))
    logger.info(f"Starting Power Management API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)