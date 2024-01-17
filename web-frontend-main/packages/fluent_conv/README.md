Fork of http://github.com/locize/fluent_conv updated to use the newest @fluent/syntax and parceljs.

## `ftl2js` optional parameters

```js
{
    // If set to `false` will ignore all kind of comments.
    // Useful for one-way conversion from ftl to js files.
    respectComments: true,
}
```

## Usage

```js
const ftl = `
emails =
  { $unreadEmails ->
    [one] You have one unread email.
   *[other] You have { $unreadEmails } unread emails.
  }

-brand-name =
  {
   *[nominative] Firefox
    [accusative] Firefoxa
  }

-another-term = another term

app-title = { -brand-name }

restart-app = Zrestartuj { -brand-name[accusative] }.

# Note: { $title } is a placeholder for the title of the web page
# captured in the screenshot. The default, for pages without titles, is
# creating-page-title-default.
login = Predefined value
  .placeholder = example@email.com
  .aria-label = Login input value
  .title = Type your login email

logout = Logout
`

const js = {
  emails:
    "{ $unreadEmails ->\n  [one] You have one unread email.\n *[other] You have { $unreadEmails } unread emails.\n}",
  "-brand-name": "{\n *[nominative] Firefox\n  [accusative] Firefoxa\n}",
  "-another-term": "another term",
  "app-title": "{ -brand-name }",
  "restart-app": "Zrestartuj { -brand-name[accusative] }.",
  login: {
    comment:
      "Note: { $title } is a placeholder for the title of the web page\ncaptured in the screenshot. The default, for pages without titles, is\ncreating-page-title-default.",
    val: "Predefined value",
    placeholder: "example@email.com",
    "aria-label": "Login input value",
    title: "Type your login email"
  },
  logout: "Logout"
}

import ftl2js from 'fluent_conv/ftl2js'
const res = ftl2js(ftl)
// res is like js
// or with callback
ftl2js(ftl, (err, res) => {
  // res is like js
})


import js2ftl from 'fluent_conv/js2ftl'
const res = js2ftl(js)
// res is like ftl
// or with callback
js2ftl(js, (err, res) => {
  // res is like ftl
})
```
