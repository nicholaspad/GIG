## **COS495-dApp**

_(name TBD)_

## Developers

Nicholas Padmanabhan, Christine Sun, Jenny Sun, Byron Zhang

## Starting a Development Server

```bash
npm run dev
```

- **Important**: Create a file named `.env.local` and store all environment variables (e.g. DB connection string) here.
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Pages auto-update as you edit their files.
- The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
- Create helper components (e.g. custom buttons) in the `/components` folder.
- Add tags to `<head>` by editing `pages/_document.tsx`.

## Formatting code

Make sure to install the Prettier formatter (VSCode extension) and set your VSCode to format on save. To set the default formatter as Prettier, do <kbd>⇧ Shift</kbd> <kbd>⌘</kbd> <kbd>P</kbd>, search "Format Document With...", and select Prettier.

## Installing dependencies

```bash
npm i
```

If you install a new dependency, make sure to push the updated `package.json` and `package-lock.json`!
