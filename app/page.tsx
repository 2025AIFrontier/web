import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  // 로그인된 상태면 대시보드로, 아니면 로그인 페이지로
  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/signin')
  }
}
