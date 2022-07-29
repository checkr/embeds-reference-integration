import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import {toastSuccess, toastFailure} from '../helpers/toasts.js'

export default function NavBar({createToast, children, account}) {
  const disconnectedCheckrAccount =
    account && account.checkrAccount.state === 'disconnected'
  const dropDownItems = {
    Documentation: () =>
      window.open(
        'https://github.com/checkr/oauth-reference-integration#readme',
      ),
    Disconnect: async () => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedToken: account.checkrAccount.accessToken,
        }),
      }

      try {
        const response = await fetch('/api/checkr/deauthorize', options)
        if (!response.ok) {
          const data = await response.json()

          createToast(
            toastFailure({
              body: 'Your request to deauthorize your account has failed. Try again later!',
              header: data.error[0],
            }),
          )
        } else {
          createToast(
            toastSuccess({
              body: 'Your account has been disconnected successfully. Please wait while Checkr finalizes your account deauthorization.',
            }),
          )
        }
      } catch (e) {
        createToast(
          toastFailure({
            body: 'Your request to deauthorize your account has failed. Try again later!',
          }),
        )
        console.error(e)
      }
    },
  }

  return (
    <Navbar bg="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <img src={'logo.png'} className="logo" alt="brand-logo" />
          <span className="px-1">Acme HR</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <NavDropdown title="John Doe" align={{lg: 'end'}}>
              {Object.entries(dropDownItems)
                .filter(
                  ([description, handleClick]) =>
                    !(
                      disconnectedCheckrAccount && description === 'Deauthorize'
                    ),
                )
                .map(([description, handleClick]) => (
                  <NavDropdown.Item key={description} onClick={handleClick}>
                    {description}
                  </NavDropdown.Item>
                ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        {children}
      </Container>
    </Navbar>
  )
}
