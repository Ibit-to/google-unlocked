name: Build
on:
  push:
    branches: [ main ]
  pull_request:

jobs:

  build:
    name: Build
    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4

      - uses: gradle/wrapper-validation-action@v1.1.0

      - uses: actions/setup-java@v4
        with:
          distribution: zulu
          java-version: 11

      - name: Setup Gradle
        uses: gradle/gradle-build-action@v2
        with:
          gradle-home-cache-cleanup: true

      - name: Build plugin
        run: ./gradlew buildPlugin

      - name: Prepare Plugin Artifact
        id: artifact
        shell: bash
        run: |
          cd ./build/distributions
          FILENAME=`ls *.zip`
          unzip "$FILENAME" -d content

          echo "filename=${FILENAME:0:-4}" >> $GITHUB_OUTPUT

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: ${{ steps.artifact.outputs.filename }}
          path: ./build/distributions/content/*/*

  test:
    name: Test
    needs: [ build ]
    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: zulu
          java-version: 11

      - name: Setup Gradle
        uses: gradle/gradle-build-action@v2
        with:
          gradle-home-cache-cleanup: true

      - name: Run Tests
        run: ./gradlew check

      - name: Collect Tests Result
        if: ${{ failure() }}
        uses: actions/upload-artifact@v3
        with:
          name: tests-result
          path: ${{ github.workspace }}/build/reports/tests
