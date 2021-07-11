import React from 'react'
import Link from 'next/link';


interface HeaderProps {
  currentUser: {};
}

const Header: React.FC<HeaderProps> = function HeaderComponent({ currentUser }) {
  // 2 options: 
  // either
  // !currentUser ===> links = [ true, true, false ] ===> [ { label: 'Sign Up', href: '/auth/signup' }, { label: 'Sign In', href: '/auth/signin' }, false ]
  // or currentUser ===> links = [ false, false, true ] ===> [ false, false, { label: 'Sign Out', href: '/auth/signout' } ]
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' }, // [0]
    !currentUser && { label: 'Sign In', href: '/auth/signin' }, // [1]
    currentUser && { label: 'Sign Out', href: '/auth/signout' } // [2]
  ]
    .filter(linkConfig => linkConfig) // for each index, will only return only indices w/c are truthy (i.e. those that exist)
    .map(({ label, href }, i) => {
      return (
        <li key={i}>
          <Link href={href}>
            <a>{label}</a>
          </Link>
        </li>
      )
    })

  return (
    <nav>
      <Link href="/">
        <a>GitTix</a>
      </Link>
      <div>
        <ul>
          {links}
        </ul>
      </div>
    </ nav>
  );
}

export default Header;