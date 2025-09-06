import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { ResourceProperties } from './resource-properties'

interface Resource {
  id: number
  category: string
  members: {
    name: string
    image: StaticImageData
    link: string
  }[]
  title: string
  link: string
  content: string
  dates: {
    from: string
    to: string
  }
  type: string
}

export default function ResourceCard({ resource }: { resource: Resource }) {

  const {
    typeColor,
    categoryIcon,
  } = ResourceProperties() 

  return (
    <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="flex flex-col h-full p-5">
        <header>
          <div className="flex items-center justify-between">
            {categoryIcon(resource.category)}
            <div className="flex shrink-0 -space-x-3 -ml-px">
              {
                resource.members.map(member => {
                  return (
                    <Link key={member.name} className="block" href={member.link}>
                      <Image className="rounded-full border-2 border-white dark:border-gray-800 box-content" src={member.image} width={28} height={28} alt={member.name} />
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </header>
        <div className="grow mt-2">
          <Link className="inline-flex text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white mb-1" href={resource.link}>
            <h2 className="text-xl leading-snug font-semibold">{resource.title}</h2>
          </Link>
          <div className="text-sm">{resource.content}</div>
        </div>
        <footer className="mt-5">
          <div className="text-sm font-medium text-gray-500 mb-2">{resource.dates.from} <span className="text-gray-400 dark:text-gray-600">-&gt;</span> {resource.dates.to}</div>
          <div className="flex justify-between items-center">
            <div>
              <div className={`text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1 ${typeColor(resource.type)}`}>{resource.type}</div>
            </div>
            <div>
              <Link className="text-sm font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href={resource.link}>자료 보기 -&gt;</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}