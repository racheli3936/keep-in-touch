# =====================
# בסיס להרצה – כולל Tesseract
# =====================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
USER root

# התקנת תלות בסיסית
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    gnupg2 \
    lsb-release \
    software-properties-common \
    wget \
    libc6-dev \
    libgdiplus \
    libx11-dev \
    libleptonica-dev

# העתקת מפתח ההתקנה של notesalexp
COPY Api/alexp_key.asc /tmp/alexp_key.asc

# הוספת המפתח למערכת המפתחות
RUN apt-key add /tmp/alexp_key.asc && rm /tmp/alexp_key.asc

# הוספת מאגר notesalexp + התקנת Tesseract
RUN echo "deb https://notesalexp.org/tesseract-ocr5/$(lsb_release -cs)/ $(lsb_release -cs) main" \
    > /etc/apt/sources.list.d/notesalexp.list && \
    apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-heb

# קישורים לספריות ש-Tesseract .NET מצפה להן
RUN mkdir -p /app/x64 && \
    ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/x64/libleptonica-1.82.0.so && \
    ln -s /usr/lib/x86_64-linux-gnu/libtesseract.so.5 /app/x64/libtesseract51.so && \
    ln -s /usr/lib/x86_64-linux-gnu/libtesseract.so.5 /app/x64/libtesseract50.so && \
    ln -s /lib/x86_64-linux-gnu/libdl.so.2 /app/x64/libdl.so

# משתנים סביבתיים
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/5/tessdata
ENV LD_LIBRARY_PATH=/app/x64:/usr/local/lib:/usr/lib:/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu

EXPOSE 8080
EXPOSE 8081

# =====================
# שלב הבנייה
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
# שלב הפרסום
# =====================
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# =====================
# שלב סופי
# =====================
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Api.dll"]
