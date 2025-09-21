import './Header.css'
import IconProfile from './IconProfile/IconProfile'
import SlideBar from './SlideBar/SlideBar'
import SwitchModo from './SwitchModo/SwitchModo'


function Header(props) {

  return (
    <>
    <header className='header'>
      <div className='ajust'>
        <SlideBar></SlideBar>  
        </div>
        <h1 className='title'>{props.title}</h1>
      <div className='controle'>
        <SwitchModo></SwitchModo>
        <IconProfile></IconProfile>
      </div>
    </header>
    </>
  )
}

export default Header