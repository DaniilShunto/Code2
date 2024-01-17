#!/bin/bash

# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

#generate from the icons/source folder or whatever the location of the SVG's is

for f in *.svg; do

    componentName=$(echo "${f%.*}" | perl -pe 's/(^|-)./uc($&)/ge;s/-//g')

cat > "${componentName}Icon.tsx" << EOF
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as ${componentName} } from './source/${f}';

const ${componentName}Icon = (props: SvgIconProps) => <SvgIcon {...props} component={${componentName}} inheritViewBox />;

export default ${componentName}Icon;
EOF

    mv ${componentName}Icon.tsx ../${componentName}Icon.tsx
done
