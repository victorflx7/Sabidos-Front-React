import './Footer.css'


   
function Footer() {

  return (
        <>
            <footer >
            <div className="Redes">
                    <img src="icon/instagram.svg" alt="Logo_Instagram" className="LOGREDES"/>
                     <img src="icon/X.svg" alt="Logo_Twitter_X" className="LOGREDES" />
                    <img src="icon/github.svg" alt="Logo_GitHub" className="LOGREDES" />
                 </div>

                 <div className="Centrado">
                    
                    <p id="pfoo" className="texto Centrado">
                        © 2025 Sabidos. Todos os direitos reservados.
                    </p>
                </div>
                <div className="List">
                </div>
            </footer>
        </>
  )
}

export default Footer
