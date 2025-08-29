    console.log(`Release procedure:
    - Create issue and a branch associated to that issue, and paste code
    - Change version in package.json
    - Change version and versiondate in store.js
    - npm run release
    - Create a new branch: git checkout -b moneymoney-${process.env.npm_package_version}
    - npm run translate
    - Edit src/locales/* if necesary
    - npm run playwright_console
    - git commit -am moneymoney-${process.env.npm_package_version}
    - git push 
    - Create Pull request in github checking it has no problem github actions
    - New github release ${process.env.npm_package_version}
    - Set changelog detailed
    - git checkout main
    - git pull
`)
