Write-Host "Building client..." -ForegroundColor Green
Set-Location -Path client
npm run build:prod

Write-Host "Moving build files to server..." -ForegroundColor Green
if (Test-Path -Path "../server/public") {
    Remove-Item -Path "../server/public" -Recurse -Force
}
New-Item -Path "../server/public" -ItemType Directory
Copy-Item -Path "dist/*" -Destination "../server/public" -Recurse

Write-Host "Installing production dependencies..." -ForegroundColor Green
Set-Location -Path ../server
npm install --production

Write-Host "Starting server in production mode..." -ForegroundColor Green
npm run prod
