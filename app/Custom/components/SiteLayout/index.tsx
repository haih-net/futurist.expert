import type * as React from 'react'
import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigationType } from 'react-router'
import { Frame, Header, Footer } from './styles'

export const SiteLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation()
  const action = useNavigationType()
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current !== pathname && action !== 'POP') {
      document
        .querySelector<HTMLElement>('#main-content h1')
        ?.focus({ preventScroll: true })
    }
    previous.current = pathname
  }, [pathname, action])
  return (
    <Frame>
      <a className="skip-link" href="#main-content">
        К содержанию
      </a>
      <Header>
        <div className="wrap">
          <Link className="brand" to="/" aria-label="Futurist.expert — главная">
            futurist<span>.expert</span>
          </Link>
          <nav aria-label="Основная навигация">
            <NavLink to="/" end>
              Подход
            </NavLink>
            <NavLink to="/concepts">Концепты</NavLink>
          </nav>
        </div>
      </Header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer>
        <div className="wrap">
          <div>
            <strong>Futurist.expert</strong>
            <p>Исследовать будущее. Мыслить системами. Проверять практикой.</p>
          </div>
          <a href="https://fi1osof.ru" target="_blank" rel="noopener noreferrer">
            By <span>𝕱</span>
          </a>
        </div>
      </Footer>
    </Frame>
  )
}
