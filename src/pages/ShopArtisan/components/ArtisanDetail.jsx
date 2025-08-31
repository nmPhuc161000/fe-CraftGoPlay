import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import bannerImg from "../../../assets/images/background2.png";
import userService from "../../../services/apis/userApi";

const formatDateVi = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const ArtisanDetail = ({ artisanId }) => {
  const [loading, setLoading] = useState(true);
  const [artisan, setArtisan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userService.getCurrentArtisan(artisanId);
        if (cancel) return;

        if (res?.success && res.data?.error === 0) {
          setArtisan(res.data.data);
        } else {
          setError(res?.data?.message || "Không lấy được thông tin nghệ nhân");
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    if (artisanId) fetchData();
    return () => { cancel = true; };
  }, [artisanId]);

  if (loading) return <div className="p-6 text-gray-600">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!artisan) return null;

  const { userName, thumbnail, dateOfBirth, craftVillage } = artisan;

  return (
    <div className="bg-gradient-to-br from-[#f5ede6] via-[#f5f5f5] to-[#f7f3ef] w-full pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Banner */}
        <div className="relative">
          <div
            className="h-40 w-full rounded-2xl bg-cover bg-center bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]"
            style={{ backgroundImage: `url(${bannerImg})` }}
          ></div>

          {/* Avatar + Info */}
          <div className="absolute -bottom-12 left-6 flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border-4 border-white shadow-md">
              <img
                src={thumbnail || "https://placehold.co/200x200?text=Artisan"}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-xl shadow px-4 py-2">
              <h1 className="text-2xl font-bold text-[#5e3a1e]">
                {userName || "Nghệ nhân"}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                {craftVillage?.location && (
                  <span className="inline-flex items-center gap-1 bg-[#fff7e6] px-3 py-1 rounded-full text-gray-700">
                    <FaMapMarkerAlt className="text-[#c7903f]" />
                    {craftVillage.location}
                  </span>
                )}
                {craftVillage?.establishedDate && (
                  <span className="inline-flex items-center gap-1 bg-[#eef9f2] px-3 py-1 rounded-full text-gray-700">
                    <FaCalendarAlt className="text-green-600" />
                    {formatDateVi(craftVillage.establishedDate)}
                  </span>
                )}
                {dateOfBirth && (
                  <span className="inline-flex items-center gap-1 bg-[#f0f4ff] px-3 py-1 rounded-full text-gray-700">
                    🎂 {formatDateVi(dateOfBirth)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer dưới banner */}
        <div className="h-16"></div>

        {/* Craft Village Card */}
        {craftVillage && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-[#5e3a1e]">
              Làng nghề: {craftVillage.village_Name}
            </h2>
            {craftVillage.description && (
              <p className="text-gray-700 leading-relaxed">
                {craftVillage.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDetail;