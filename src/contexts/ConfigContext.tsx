import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ServiceConfig {
  host: string;
  port: string;
  protocol: string;
}

export interface AllServicesConfig {
  [serviceName: string]: ServiceConfig;
}

export interface ExchangeConfig {
  api: {
    'base-url': string;
    'auth-key': string;
  };
  database: {
    'table-name': string;
  };
  scheduler: {
    'daily-update-hour': number;
    'daily-update-minute': number;
    enabled: boolean;
  };
}

interface ConfigContextType {
  servicesConfig: AllServicesConfig;
  exchangeConfig: ExchangeConfig | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [servicesConfig, setServicesConfig] = useState<AllServicesConfig>({});
  const [exchangeConfig, setExchangeConfig] = useState<ExchangeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllServicesConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. PostgREST로 모든 서비스 설정 가져오기
      const servicesResponse = await fetch('/postgrest/env_configs?section=eq.services');
      if (!servicesResponse.ok) {
        throw new Error('서비스 설정 로드 실패');
      }

      const servicesConfigs = await servicesResponse.json();
      
      // 서비스별로 그룹화
      const groupedConfigs: { [key: string]: { [key: string]: string } } = {};
      servicesConfigs.forEach((config: any) => {
        if (!groupedConfigs[config.subsection]) {
          groupedConfigs[config.subsection] = {};
        }
        groupedConfigs[config.subsection][config.key] = config.value;
      });

      // ServiceConfig 형태로 변환 (필수 키 확인)
      const servicesConfig: AllServicesConfig = {};
      Object.keys(groupedConfigs).forEach(serviceName => {
        const config = groupedConfigs[serviceName];
        if (!config.host || !config.port || !config.protocol) {
          throw new Error(`${serviceName} 서비스의 필수 설정이 누락되었습니다 (host, port, protocol)`);
        }
        servicesConfig[serviceName] = {
          host: config.host,
          port: config.port,
          protocol: config.protocol
        };
      });

      setServicesConfig(servicesConfig);

      // 전역 접근을 위해 window 객체에 설정 저장
      (window as any).__RUNTIME_CONFIG__ = {
        servicesConfig,
      };

      // 2. Exchange 설정 가져오기
      const exchangeResponse = await fetch('/postgrest/env_configs?section=eq.exchange');
      if (exchangeResponse.ok) {
        const exchangeConfigs = await exchangeResponse.json();
        
        // exchange 설정을 subsection별로 그룹화
        const exchangeGrouped: { [key: string]: { [key: string]: any } } = {};
        exchangeConfigs.forEach((config: any) => {
          if (!exchangeGrouped[config.subsection]) {
            exchangeGrouped[config.subsection] = {};
          }
          exchangeGrouped[config.subsection][config.key] = config.value;
        });

        // ExchangeConfig 형태로 변환 (필수 키 확인)
        if (!exchangeGrouped.api?.['base-url'] || !exchangeGrouped.database?.['table-name']) {
          throw new Error('Exchange 설정의 필수 키가 누락되었습니다');
        }

        if (!exchangeGrouped.api?.['auth-key']) {
          throw new Error('Exchange API auth-key가 누락되었습니다');
        }
        if (!exchangeGrouped.scheduler?.['daily-update-hour']) {
          throw new Error('Exchange scheduler daily-update-hour가 누락되었습니다');
        }
        if (!exchangeGrouped.scheduler?.['daily-update-minute']) {
          throw new Error('Exchange scheduler daily-update-minute가 누락되었습니다');
        }
        if (!exchangeGrouped.scheduler?.enabled) {
          throw new Error('Exchange scheduler enabled가 누락되었습니다');
        }

        const exchangeConfig: ExchangeConfig = {
          api: {
            'base-url': exchangeGrouped.api['base-url'],
            'auth-key': exchangeGrouped.api['auth-key']
          },
          database: {
            'table-name': exchangeGrouped.database['table-name']
          },
          scheduler: {
            'daily-update-hour': parseInt(exchangeGrouped.scheduler['daily-update-hour']),
            'daily-update-minute': parseInt(exchangeGrouped.scheduler['daily-update-minute']),
            enabled: exchangeGrouped.scheduler.enabled === 'true'
          }
        };

        setExchangeConfig(exchangeConfig);

        // Exchange 설정도 전역에 저장
        (window as any).__RUNTIME_CONFIG__.exchangeConfig = exchangeConfig;
      }
    } catch (err) {
      console.error('Error fetching configs:', err);
      setError(err instanceof Error ? err.message : '설정 로드 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = async () => {
    await fetchAllServicesConfig();
  };

  useEffect(() => {
    fetchAllServicesConfig();
  }, []);

  const value: ConfigContextType = {
    servicesConfig,
    exchangeConfig,
    loading,
    error,
    refreshConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};