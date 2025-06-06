# =====================
# ��� ���� �� Tesseract
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

# ����� ���� ����� ����
ENV TESSDATA_PREFIX=/usr/local/share/tessdata
RUN mkdir -p $TESSDATA_PREFIX && \
    wget -O $TESSDATA_PREFIX/heb.traineddata "https://github.com/tesseract-ocr/tessdata_best/raw/main/heb.traineddata"

# ����� ������ ���� ��
RUN ls -l /usr/local/share/tessdata/heb.traineddata || echo "heb.traineddata not found"

EXPOSE 8080
EXPOSE 8081

# =====================
# ��� �����
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
# ��� �����
# =====================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# =====================
# ��� ���� �����
# =====================
FROM base AS final
WORKDIR /app
ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/lib:/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu
RUN ldconfig
RUN find / -name "libleptonica*.so*" || echo "libleptonica not found"
#RUN ln -s /usr/local/lib/libleptonica*.so /usr/local/lib/libleptonica-1.82.0.so || echo "symlink already exists or not needed"
RUN ln -s /usr/lib/x86_64-linux-gnu/libleptonica.so /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so || echo "symlink already exists"

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.dll"]


