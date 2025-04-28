import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PDF Reader
          </Typography>
          <Link to={"/"} className="px-2">
            Home
          </Link>
          <Link to={"/upload"} className="px-2">
            Upload
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
