import { useState, type FC } from 'react'
import './App.css'

const TempComp = () => <p>Visible</p>

export const App: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const onHello = () => {
    setIsVisible((preservate) => !preservate)
  }

  return (
    <>
      <h1>App</h1>
      <button onClick={onHello}>hello</button>
      {isVisible ? <TempComp /> : null}
    </>
  )
}
