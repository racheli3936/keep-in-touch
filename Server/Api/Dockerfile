# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER root

# התקנת כלים בסיסיים
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    software-properties-common \
    apt-transport-https \
    ca-certificates

# הוספת המפתח והמאגר של Tesseract החדש
RUN wget -O - https://notesalexp.org/debian/alexp_key.asc | apt-key add - \
    && echo "deb https://notesalexp.org/tesseract-ocr5/$(lsb_release -cs)/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/notesalexp.list

# עדכון והתקנת Tesseract וכל התלויות
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-heb \
    libtesseract-dev \
    libleptonica-dev \
    libgif-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libwebp-dev \
    && rm -rf /var/lib/apt/lists/*

# יצירת כל ה-symlinks הנדרשים לגרסאות שונות
RUN find /usr/lib -name "libleptonica.so*" | head -1 | xargs -I {} sh -c 'ln -sf {} /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so; ln -sf {} /usr/lib/x86_64-linux-gnu/libleptonica.so.5; ln -sf {} /usr/lib/libleptonica-1.82.0.so'

# וידוא שהקבצים קיימים
RUN ldconfig && \
    find /usr/lib -name "*leptonica*" -type f && \
    find /usr/lib -name "*tesseract*" -type f

USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
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

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# הגדרת משתני סביבה מפורטים
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata:/usr/share/tesseract-ocr/5/tessdata
ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:/usr/lib:/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
ENV TESSERACT_PREFIX=/usr
ENV LIBLEPT_HEADERSDIR=/usr/include

# הוספת רישויי הספריות לנתיב
RUN echo "/usr/lib/x86_64-linux-gnu" >> /etc/ld.so.conf.d/tesseract.conf && \
    echo "/usr/lib" >> /etc/ld.so.conf.d/tesseract.conf && \
    ldconfig

ENTRYPOINT ["dotnet", "Api.dll"]