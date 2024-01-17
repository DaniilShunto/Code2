import React from 'react';
import LocaleDropdownNavbarItem from '@theme-original/NavbarItem/LocaleDropdownNavbarItem';
import {useLocation} from '@docusaurus/router';

export default function LocaleDropdownNavbarItemWrapper(props) {

    // HACK: If path contains doesn't contain 'user' do not display, because we currently only have any translations for
    // the user docs
    const {pathname} = useLocation()
    if (!pathname.includes('user')) {
        return null;
    }

    return <LocaleDropdownNavbarItem {...props} />;
}
