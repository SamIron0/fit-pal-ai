import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'

export const runtime = 'edge'

  const id = nanoid()

  function openChat(){
     return <Chat id={id} />
  }
