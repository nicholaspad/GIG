# GIG

> Take surveys. Earn crypto. The easiest way to get into web3.

## Developers

Nicholas Padmanabhan, Christine Sun, Jenny Sun, Byron Zhang

## Local Development

```bash
npm run dev
```

- **Important**: Create a file named `.env.local` and store all environment variables (e.g. DB connection string) here.
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Pages auto-update as you edit their files.
- The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
- Create helper components (e.g. custom buttons) in `/components`.
- Add tags to `<head>` by editing `pages/_document.tsx`.

## Formatting code

Install the Prettier formatter (VSCode extension) and set your VSCode to format on save. To set the default formatter as Prettier, do <kbd>⇧ Shift</kbd> <kbd>⌘</kbd> <kbd>P</kbd>, search "Format Document With...", and select Prettier.

## Installing dependencies

```bash
npm i
```

If you install a new dependency, make sure to push the updated `package.json` and `package-lock.json`!
