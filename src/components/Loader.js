import spinner from './spinner.gif'
import {useEffect,useState } from 'react'

const Loader = () => {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length < 3 ? prev + '.' : '.');
        }, 500);

  return() =>clearInterval(interval)
     }, [])

    return (
        <div className='loader'>
            <img src={spinner} alt="A carregar..." />
            <h1>A procurar por dados{dots}</h1>
    </div>
  )
}

export default Loader;