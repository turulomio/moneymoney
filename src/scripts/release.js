    console.log(`Release procedure:
    - Change version in package.json
    - Change version and versiondate in store.js
    - npm run release
    - Create a new branch: git checkout -b moneymoney-${process.env.npm_package_version}
    - Edit Changelog in README.md
    - npm run translate
    - Edit src/locales/* if necesary
    - npm run cypress_console
    - git commit -am moneymoney-${process.env.npm_package_version}
    - git push --set-upstream origin moneymoney-${process.env.npm_package_version}
    - Merge Pull request in github
    - New github release ${process.env.npm_package_version}
    - git checkout main
    - Return to main branch: git checkout main
    - Update main branch: git pull
`)
