"use client";

interface ProfileImageDeleteProps {
  userId: string | null;
}

const ProfileImageDelete: React.FC<ProfileImageDeleteProps> = ({ userId }) => {
  const handleDelete = async () => {
    const response = await fetch("/api/image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePublicId: userId })
    });

    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("프로필 사진이 성공적으로 삭제되었습니다");
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>프로필 이미지 삭제하기</button>
    </div>
  );
};

export default ProfileImageDelete;
