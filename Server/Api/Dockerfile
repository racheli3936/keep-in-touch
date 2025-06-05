# =====================
# שלב התקנת Tesseract
# =====================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS tesseract
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

ENV TESSDATA_PREFIX=/usr/local/share/tessdata
RUN mkdir -p $TESSDATA_PREFIX && \
    wget -O $TESSDATA_PREFIX/heb.traineddata "https://github.com/tesseract-ocr/tessdata_best/raw/main/heb.traineddata"

EXPOSE 8080
EXPOSE 8081
# =====================
# שלב סופי
# =====================
FROM tesseract AS final
WORKDIR /app

RUN find / -name "eng.traineddata"

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]
