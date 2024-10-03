import ClearvisionLogo from "./images/clearvision-logo.svg"

function Header(){

  return (
    <header className="app-header">
      <h1 className="app-header__title">PURCHASE ORDER MANAGEMENT</h1>
      <img src={ClearvisionLogo} alt="clearvision logo"/>
    </header>
  )
}

export default Header;