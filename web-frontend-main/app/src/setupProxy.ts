// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

interface Application {
  use: (middleware: (req: Request, res: Response, next: () => void) => void) => void;
}

const proxyHeaderMiddleware = (app: Application) => {
  app.use((req, res, next) => {
    res.headers.get('Access-Control-Allow-Origin'); // update to match the domain you will make the request from
    res.headers.get('Access-Control-Allow-Headers');
    next();
  });
};
export default proxyHeaderMiddleware;
