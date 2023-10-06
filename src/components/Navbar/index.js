import React from "react";
import { Nav, NavLink, NavMenu }
    from "./NavbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/about" activeStyle>
                        Home
                    </NavLink>
                    <NavLink to="/contact" activeStyle>
                        Movies
                    </NavLink>
                    <NavLink to="/blogs" activeStyle>
                        Customer
                    </NavLink>
                    <NavLink to="/sign-up" activeStyle>
                        Reports
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;