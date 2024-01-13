import { Link } from "react-router-dom";

// material-ui
import { ButtonBase, Typography } from "@mui/material";

// project imports
import config from "../../../config";
import Logo from "../../../components/Logo";
import { useStore } from "../../../store";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
    const defaultId = useStore((state) => state.defaultId);
    const menuOpen = useStore((state) => state.menuOpen);

    return (
        <ButtonBase
            disableRipple
            onClick={() => menuOpen(defaultId)}
            component={Link}
            to={config.defaultPath}
        >
            <Logo />
            <Typography variant="h3" color="inherit">
                Guild Genius
            </Typography>
        </ButtonBase>
    );
};

export default LogoSection;
