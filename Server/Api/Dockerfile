# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

# התקנת Tesseract ודיבוג
USER root
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-heb \
    libtesseract-dev \
    libleptonica-dev \
    && rm -rf /var/lib/apt/lists/*

# דיבוג - לראות מה באמת קיים
RUN echo "=== Debug: Looking for leptonica files ===" \
    && find /usr -name "*leptonica*" -type f 2>/dev/null | head -10 \
    && echo "=== Debug: Looking in common lib directories ===" \
    && ls -la /usr/lib/x86_64-linux-gnu/*leptonica* 2>/dev/null || echo "Not found in x86_64-linux-gnu" \
    && ls -la /usr/lib/*leptonica* 2>/dev/null || echo "Not found in /usr/lib" \
    && ls -la /lib/x86_64-linux-gnu/*leptonica* 2>/dev/null || echo "Not found in /lib/x86_64-linux-gnu"

# יצירת symlinks חכמה - מוצא את הקובץ הנכון אוטומטית
RUN LEPTONICA_LIB=$(find /usr -name "libleptonica.so*" -type f | head -1) \
    && if [ -n "$LEPTONICA_LIB" ]; then \
        echo "Found leptonica at: $LEPTONICA_LIB"; \
        ln -sf "$LEPTONICA_LIB" /usr/lib/libleptonica-1.82.0.so; \
        ln -sf "$LEPTONICA_LIB" /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so; \
        ln -sf "$LEPTONICA_LIB" /usr/local/lib/libleptonica-1.82.0.so; \
    else \
        echo "ERROR: libleptonica not found!"; \
    fi

# עדכון ldconfig
RUN ldconfig

# וידוא סופי
RUN echo "=== Final verification ===" \
    && ls -la /usr/lib/*leptonica* 2>/dev/null || echo "No leptonica in /usr/lib" \
    && ls -la /usr/lib/x86_64-linux-gnu/*leptonica* 2>/dev/null || echo "No leptonica in x86_64-linux-gnu" \
    && ldconfig -p | grep leptonica || echo "leptonica not found in ldconfig"

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

# הגדרות סביבה מרובות נתיבים
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata:/usr/share/tesseract-ocr/5/tessdata
ENV LD_LIBRARY_PATH=/usr/lib:/usr/lib/x86_64-linux-gnu:/usr/local/lib:/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "Api.dll"]