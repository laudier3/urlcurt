-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_urlId_fkey";

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
