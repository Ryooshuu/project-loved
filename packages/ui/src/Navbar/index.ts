import NavbarRoot from "./NavbarRoot.vue";
import NavbarSection from "./NavbarSection.vue";
import NavbarItem from "./NavbarItem.vue";

export const Navbar = {
    Root: NavbarRoot,
    Section: NavbarSection,
    Item: NavbarItem
} as {
    Root: typeof NavbarRoot
    Section: typeof NavbarSection
    Item: typeof NavbarItem
};
