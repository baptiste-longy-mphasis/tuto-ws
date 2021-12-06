FROM mcr.microsoft.com/windows/servercore:ltsc2019

LABEL author="Mphasis Wyde"

# Download NodeJs
WORKDIR /downloads
ADD https://nodejs.org/dist/v12.18.3/node-v12.18.3-x64.msi nodejs.msi

# Install NodeJs
RUN msiexec.exe /qn /i nodejs.msi
RUN setx path "%path%;C:\Program Files\nodejs"

# Install ODBC Driver for PG
ADD https://ftp.postgresql.org/pub/odbc/versions/msi/psqlodbc_09_06_0100-x64.zip psqlodbc.zip
RUN tar.exe -xf psqlodbc.zip
RUN msiexec.exe /qn /i psqlodbc_x64.msi

# Bundle app source
WORKDIR /app
COPY . .

# RUN powershell.exe -executionpolicy bypass ./docker/create-odbc-connection.ps1


# Declare entrypoints

EXPOSE 8080 8081 5000
# Node hosting :
ENTRYPOINT ["node.exe", "./server.js"]