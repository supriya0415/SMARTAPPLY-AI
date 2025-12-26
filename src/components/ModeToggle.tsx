'use client'

import { SunIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  return (
    <Button variant="ghost" className="w-9 px-0" disabled>
      <SunIcon className="h-[1.2rem] w-[1.2rem] text-orange-500" />
      <span className="sr-only">Light mode active</span>
    </Button>
  )
}
