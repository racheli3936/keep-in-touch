# בסיס עם ASP.NET 9.0
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

# הרשאות root כדי שנוכל להתקין חבילות
USER root

# התקנת Tesseract, עברית, Leptonica
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-heb \
    libtesseract-dev \
    libleptonica-dev \
    && ldconfig \
    && rm -rf /var/lib/apt/lists/*

# תיקיית עבודה
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# שלב בנייה עם SDK
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# העתקת קבצי csproj וביצוע restore
COPY ["Api/Api.csproj", "Api/"]
COPY ["Core/Core.csproj", "Core/"]
COPY ["Data/Data.csproj", "Data/"]
COPY ["Service/Service.csproj", "Service/"]
RUN dotnet restore "Api/Api.csproj"

# העתקת שאר הקבצים ובנייה
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# שלב publish
FROM build AS publish
RUN dotnet publish "Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# שלב הריצה הסופי
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# הגדרות סביבתיות לזיהוי tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata
ENV LD_LIBRARY_PATH=/usr/lib:/usr/lib/x86_64-linux-gnu:/usr/local/lib:/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "Api.dll"]
