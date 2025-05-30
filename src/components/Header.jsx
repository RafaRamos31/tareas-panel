import { NotificationIcon } from "./NotificationIcon"
import { UserIcon } from "./UserIcon"
import { Breadcrumbs } from "@mui/material";

export const Header = ({breadcrumbs}) => {

  return (
    <header className="w-100 d-flex justify-content-between header-profile">
      {
        <Breadcrumbs className="my-auto mx-3">
          {
            breadcrumbs && breadcrumbs.map((link) => (
              <a key={link.nombre} to={link.link} style={{color: 'black', textDecoration: 'none', fontStyle: 'italic'}}>
                {link.nombre}
              </a>
            ))
          }
        </Breadcrumbs>
      }
      <>
      {
        <div className="d-flex">
          <NotificationIcon />
          <UserIcon />
        </div>
      }
      </>
    </header>
  )
}
