-- CreateTable
CREATE TABLE "pix_token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "pix_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "urlTxt" TEXT NOT NULL,

    CONSTRAINT "infos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pix_token_token_key" ON "pix_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "infos_pix_key" ON "infos"("pix");

-- CreateIndex
CREATE UNIQUE INDEX "infos_urlTxt_key" ON "infos"("urlTxt");
