import oilChange from "./images/oil-change.jpg";
import tireRepair from "./images/tyre-repair.jpg";
import carWash from "./images/car_wash.jpg";
import engineRepair from "./images/engine repair.jpg";
import logo from "./images/logo.png";
import profilePic from "./images/profilePic.jpg";
import dropDownIcon from "./images/dropdown_icon.svg";
import menuIcon from "./images/menu_icon.svg";
import image1 from "./images/image1.jpg";
import image2 from "./images/image2.jpg";
import image3 from "./images/image3.jpg";

const services = [
    { id: "oil-change", title: "Oil Change", img: oilChange, description: "Keep your engine running smoothly with regular oil changes." },
    { id: "tire-repair", title: "Tire Repair", img: tireRepair, description: "We fix punctures and replace worn-out tires." },
    { id: "car-wash", title: "Car Wash", img: carWash, description: "Get a spotless shine with our premium car wash." },
    { id: "engine-repair", title: "Engine Repair", img: engineRepair, description: "Professional engine diagnostics and repairs." }
];

export const assets = {
    services,
    logo,
    profilePic,
    menuIcon,
    dropDownIcon,
    image1,
    image2,
    image3
}

export default assets;
