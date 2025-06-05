# בסיס להרצה (Fast mode ו־Production)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

USER root

# התקנת Tesseract ושפות נדרשות
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-heb \
    libtesseract-dev \
    libleptonica-dev \
    && rm -rf /var/lib/apt/lists/*
RUN find /usr -name "libleptonica.so*"
RUN echo ">>> חיפוש ספריית Leptonica..." && find /usr -name "libleptonica.so*"


# יצירת symlink עבור Leptonica לפי שם הקובץ הקיים
RUN LIBFILE=$(find /usr -name "libleptonica.so*" | head -n 1) && \
    echo "Linking $LIBFILE to /usr/lib/libleptonica-1.82.0.so" && \
    ln -sf "$LIBFILE" /usr/lib/libleptonica-1.82.0.so || echo "Symlink failed, but continuing"

# עדכון ldconfig
RUN ldconfig

# הגדרות סביבתיות עבור Tesseract
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata:/usr/share/tesseract-ocr/5/tessdata
ENV LD_LIBRARY_PATH=/usr/lib:/usr/lib/x86_64-linux-gnu:/usr/local/lib:/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# שלב בנייה
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

# שלב publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# שלב סופי
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]
