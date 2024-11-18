import { RenderArticle } from "@/app/components/dashboard/RenderArticle";
import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JSONContent } from "novel";

// Funkcja asynchroniczna do pobierania danych z bazy
async function getData(slug: string) {
  const data = await prisma.post.findUnique({
    where: { slug },
    select: {
      articleContent: true,
      title: true,
      smallDescription: true,
      image: true,
      createdAt: true,
    },
  });

  if (!data) {
    notFound(); // Wywołanie funkcji `notFound`
  }

  return data;
}

// Typy dla `params` zgodne z Next.js
interface PageProps {
  params: { slug: string; name: string }; // Dynamiczne parametry
}

// Komponent strony
export default async function SlugRoute({ params }: PageProps) {
  // Pobieranie danych
  const data = await getData(params.slug);

  // Render strony
  return (
    <>
      <div className="flex items-center gap-x-3 pt-10 pb-5">
        <Button size="icon" variant="outline" asChild>
          <Link href={`/blog/${params.name}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-medium">Go Back</h1>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto my-5 w-10/12 text-sm font-light text-muted-foreground md:text-base">
            {new Intl.DateTimeFormat("pl", {
              dateStyle: "medium",
            }).format(new Date(data.createdAt))} {/* Upewnij się, że `createdAt` to Date */}
          </p>
          <h1 className="mb-5 text-3xl font-bold md:text-6xl tracking-tight">
            {data.title}
          </h1>
          <p className="m-auto w-10/12 text-muted-foreground line-clamp-3">
            {data.smallDescription}
          </p>
        </div>
      </div>

      <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-[450px] md:w-5/6 md:rounded-2xl lg:w-2/3">
        <Image
          src={data.image}
          alt={data.title}
          width={1200}
          height={630}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      <RenderArticle json={data.articleContent as JSONContent} />
    </>
  );
}
