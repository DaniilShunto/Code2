# SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
#
# SPDX-License-Identifier: EUPL-1.2

# Enable all rules by default
all

# Markdown tables cant have breaks in them thus this is set to the largest table.
rule 'MD013', :line_length => 790

# Disable duplicate heading check
exclude_rule 'MD024'

# Loosen 'trailing whitespace' checks. Enable 2 spaces at the end for newlines.
rule 'MD009', :br_spaces => 2

# Disable check that first line must be top level header as its incompatible with docusaurus
exclude_rule 'MD041'
