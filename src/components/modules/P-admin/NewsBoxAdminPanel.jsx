import Image from "next/image";

export default function NewsBox({ image, confirmed, content, publishedAt }) {
  return (
    <div className=" rounded-2xl flex flex-col justify-between shadow-xl p-4 bg-white dark:bg-gray-800 max-w-xs max-h-[325px] h-[300px] w-full mx-auto">
      {image && (
        <div className="relative w-full h-32 mb-3 overflow-hidden rounded-xl">
          <Image
            src={`${process.env.GET_LIARA}/${image}`}
            alt={content}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
            priority
          />
        </div>
      )}

      <div className="space-y-2 mt-5 flex flex-col justify-between">
        <p className="text-sm font-bold whitespace-pre-wrap break-words text-orange-700 dark:text-gold line-clamp-4">
          {content}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          تاریخ انتشار: { new Date(publishedAt).toLocaleString('fa-IR') }
        </p>
      </div>
    </div>
  );
}
