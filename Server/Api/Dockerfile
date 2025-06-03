# שלב בסיסי עם כל הספריות הדרושות לריצה
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-heb \
    libtesseract-dev \
    libleptonica-dev \
    && rm -rf /var/lib/apt/lists/*

# נוודא שהספריות ה־native זמינות
ENV LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu:/usr/local/lib:${LD_LIBRARY_PATH}"
RUN ldconfig

WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# שלב הבנייה
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Api/Api.csproj", "Api/"]
COPY ["Core/Core.csproj", "Core/"]
COPY ["Data/Data.csproj", "Data/"]
COPY ["Service/Service.csproj", "Service/"]
RUN dotnet restore "./Api/Api.csproj"
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# שלב הפרסום
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# שלב הריצה הסופי
FROM base AS final
WORKDIR /app

# נעתיק את הקוד המפורסם מהשלב הקודם
COPY --from=publish /app/publish .


# נעתיק גם את תיקיית tessdata אם נדרשת
COPY ["Api/tessdata", "./tessdata"]
RUN chmod -R 755 ./tessdata

# בדיקת תקינות
RUN tesseract --version && \
    tesseract --list-langs && \
    ls -la /usr/lib/x86_64-linux-gnu/ | grep lept

# להסיר את השורה הזו - APP_UID לא מוגדר ולא נחוץ, וזה עלול לגרום לשגיאות גישה
# USER $APP_UID
# בדיקת תקינות ספריית Leptonica


ENTRYPOINT ["dotnet", "Api.dll"]
