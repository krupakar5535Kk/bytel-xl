@echo off
title WILD FIRE - Backend Launcher
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
set "PATH=C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\bin;C:\Users\Admin\AppData\Local\Programs\maven\apache-maven-3.9.9\bin;%PATH%"
cd /d "%~dp0backend"
mvn spring-boot:run
