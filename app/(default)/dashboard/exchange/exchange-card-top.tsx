import Image from 'next/image'
import UserImage from '@/public/images/user-64-14.jpg'
import { useState } from 'react'

export default function ExchangeIntro() {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 여기에 AI에게 질문을 보내는 로직 추가
      console.log("AI에게 질문:", inputValue)
      setInputValue("")
    }
  }

  return(
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">환율 페이지 AI 분석</h2>
        <button className="btn btn-sm bg-violet-500 hover:bg-violet-600 text-white">
          <span>프롬프트</span>
        </button>
      </header>
      <div className="px-5 py-6">
        <div className="md:flex md:justify-between md:items-center">
          {/* Left side */}
          <div className="flex items-center mb-4 md:mb-0">
            {/* Avatar */}
            <div className="mr-4">
              <Image className="inline-flex rounded-full" src={UserImage} width={64} height={64} alt="User" />
            </div>
            {/* User info */}
            <div className="flex-1">
              <div className="relative">
                <input 
                  id="ai-message" 
                  className="form-input w-full pl-9 text-lg" 
                  type="text" 
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Gauss에게 질문해보세요"
                />
                <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
                  <svg className="fill-current text-gray-400 dark:text-gray-500 shrink-0 ml-3 mr-2" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                  </svg>
                </div>
              </div>
              {/* AI Response */}
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  현재 미국 달러는 1,330원대에서 안정적인 흐름을 보이고 있습니다. 
                  유럽 중앙은행의 금리 동결 결정과 중국의 경제 지표 개선으로 
                  단기적으로는 현 수준을 유지할 것으로 예상됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
