# =====================
# שלב בסיס עם Tesseract
# =====================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
USER root

RUN apt-get update && apt-get install -y \
    g++ autoconf autoconf-archive automake libtool pkg-config \
    libpng-dev libjpeg62-turbo-dev libtiff5-dev libicu-dev \
    libpango1.0-dev wget unzip make git libleptonica-dev && \
    rm -rf /var/lib/apt/lists/*

ENV TESS_VERSION=5.0.0-rc2
WORKDIR /tmp
RUN wget "https://github.com/tesseract-ocr/tesseract/archive/${TESS_VERSION}.zip" && \
    unzip "${TESS_VERSION}.zip" && \
    cd "tesseract-${TESS_VERSION}" && \
    ./autogen.sh && ./configure && \
    make -j$(nproc) && make install && ldconfig

# הורדת מודל עברית בלבד
ENV TESSDATA_PREFIX=/usr/local/share/tessdata
RUN mkdir -p $TESSDATA_PREFIX && \
    wget -O $TESSDATA_PREFIX/heb.traineddata "https://github.com/tesseract-ocr/tessdata_best/raw/main/heb.traineddata"

# לבדוק שהקובץ באמת שם
RUN ls -l /usr/local/share/tessdata/heb.traineddata || echo "heb.traineddata not found"

EXPOSE 8080
EXPOSE 8081

# =====================
# שלב בנייה
# =====================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Api/Api.csproj", "Api/"]
COPY ["Core/Core.csproj", "Core/"]
COPY ["Data/Data.csproj", "Data/"]
COPY ["Service/Service.csproj", "Service/"]

RUN dotnet restore "Api/Api.csproj"
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# =====================
# שלב פרסום
# =====================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# =====================
# שלב סופי להרצה
# =====================
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]
