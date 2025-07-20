import React, { useState } from "react";

const ArtisanDetail = () => {
    const [artisan, setArtisan] = useState(
        {
            name: "Kenco.clothing",
            countProduct: 320,
            ratings: 1,
            ratingsCount: 12000,
            createAt: new Date(),
            img: "https://media.cnn.com/api/v1/images/stellar/prod/180703082251-pride-kiss.jpg?q=x_4,y_178,h_1965,w_3492,c_crop/h_833,w_1480",
            craftVillage: "Thợ thủ công",
        }
    );

    function formatNumberToK(num) {
        if (num < 1000) return num.toString();
        const formatted = (num / 1000).toFixed(1).replace('.', ',');
        return `${formatted}K`;
    }



    return (
        <div className="bg-white py-10">
            <div className="mx-auto my-0 max-w-[1300px]">
                <div className="flex w-full px-[20px]">
                    <div className="max-w-[400px] min-w-[300px] h-auto flex-1 p-[10px_12px_10px_20px] border border-[#d6d6d6] rounded-[10px]">
                        <div className="flex gap-[10px]">
                            <img
                                className="rounded-full w-[72px] h-[72px] object-cover object-center"
                                src={artisan.img}
                                alt=""
                            />
                            <p className="text-[20px] font-semibold">{artisan.name}</p>
                        </div>
                    </div>

                    <div className="w-full flex-1 px-[20px] py-[10px] grid grid-cols-3 gap-y-[6px] text-[14px]">
                        <div className="flex items-center gap-[6px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 3H2v6h1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9h1zM4 5h16v2H4zm15 15H5V9h14zM9 11h6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2" /></svg>
                            <i className="fa-solid fa-store text-[#333]"></i>
                            <span>Sản Phẩm:</span>
                            <span className="text-[#ee4d2d] font-medium">{artisan.countProduct}</span>
                        </div>
                        <div className="flex items-center gap-[6px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.39l-3.76 2.27l.99-4.28l-3.32-2.88l4.38-.37L12 6.09l1.71 4.04l4.38.37l-3.32 2.88l.99 4.28M22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.45 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03z" /></svg>                            <i className="fa-regular fa-star text-[#333]"></i>
                            <span>Đánh Giá:</span>
                            <span className="text-[#ee4d2d] font-medium">
                                {artisan.ratings} ({formatNumberToK(artisan.ratingsCount)} Đánh Giá)
                            </span>
                        </div>
                        <div className="flex items-center gap-[6px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 2.25C7.904 2.25 6.171 3.91 6.171 6S7.904 9.75 10 9.75S13.829 8.09 13.829 6S12.096 2.25 10 2.25M7.671 6c0-1.224 1.024-2.25 2.329-2.25S12.329 4.776 12.329 6S11.305 8.25 10 8.25S7.671 7.224 7.671 6m-.584 5.86c.064-.018.202-.011.384.106c.512.332 1.4.77 2.529.77s2.017-.438 2.53-.77c.18-.117.319-.124.383-.107q.215.06.428.128l.985.315a.75.75 0 0 0 .457-1.428l-.984-.316q-.243-.077-.488-.145c-.612-.168-1.193.033-1.596.294c-.37.24-.974.529-1.715.529c-.74 0-1.345-.29-1.715-.53c-.403-.26-.984-.461-1.596-.293q-.245.068-.488.145l-.984.316a3.77 3.77 0 0 0-2.429 2.342c-.075.22-.107.432-.125.604l-.389 3.673c-.16 1.177.493 2.388 1.781 2.687c1.199.278 3.127.57 5.945.57a.75.75 0 1 0 0-1.5c-2.714 0-4.528-.28-5.605-.53c-.427-.1-.708-.503-.634-1.03l.002-.013l.391-3.7c.014-.124.03-.208.052-.271a2.27 2.27 0 0 1 1.468-1.404l.985-.315q.213-.068.428-.128M20.53 16.03a.75.75 0 1 0-1.06-1.06L16 18.44l-1.47-1.47a.75.75 0 1 0-1.06 1.06L16 20.56z" /></svg>
                            <i className="fa-regular fa-user text-[#333]"></i>
                            <span>Tham Gia:</span>
                            <span className="text-[#ee4d2d] font-medium">6 Năm Trước</span>
                        </div>
                        <div className="flex items-center gap-[6px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 2.25C7.904 2.25 6.171 3.91 6.171 6S7.904 9.75 10 9.75S13.829 8.09 13.829 6S12.096 2.25 10 2.25M7.671 6c0-1.224 1.024-2.25 2.329-2.25S12.329 4.776 12.329 6S11.305 8.25 10 8.25S7.671 7.224 7.671 6m-.584 5.86c.064-.018.202-.011.384.106c.512.332 1.4.77 2.529.77s2.017-.438 2.53-.77c.18-.117.319-.124.383-.107q.215.06.428.128l.985.315a.75.75 0 0 0 .457-1.428l-.984-.316q-.243-.077-.488-.145c-.612-.168-1.193.033-1.596.294c-.37.24-.974.529-1.715.529c-.74 0-1.345-.29-1.715-.53c-.403-.26-.984-.461-1.596-.293q-.245.068-.488.145l-.984.316a3.77 3.77 0 0 0-2.429 2.342c-.075.22-.107.432-.125.604l-.389 3.673c-.16 1.177.493 2.388 1.781 2.687c1.199.278 3.127.57 5.945.57a.75.75 0 1 0 0-1.5c-2.714 0-4.528-.28-5.605-.53c-.427-.1-.708-.503-.634-1.03l.002-.013l.391-3.7c.014-.124.03-.208.052-.271a2.27 2.27 0 0 1 1.468-1.404l.985-.315q.213-.068.428-.128M20.53 16.03a.75.75 0 1 0-1.06-1.06L16 18.44l-1.47-1.47a.75.75 0 1 0-1.06 1.06L16 20.56z" /></svg>
                            <i className="fa-regular fa-user text-[#333]"></i>
                            <span>Làng Nghề:</span>
                            <span className="text-[#ee4d2d] font-medium">{artisan.craftVillage}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default ArtisanDetail;