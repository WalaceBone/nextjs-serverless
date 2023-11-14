import Image from 'next/image'
import { Inter } from 'next/font/google'
import UploadPage from './upload'
import Send from './send'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} mx-auto justify-center`}
    >
      <div className="logo-container">
        <Image src="/logo.svg" alt="Abbeal logo" layout="responsive" width={150} height={150} />
        <h1 className="text-center">Pour envoyer la liste des collaborateurs sur Basile</h1>
      </div>
      <div className='upload-container'>
        <UploadPage />
        <Send />
      </div>
    </main>
  )
}
