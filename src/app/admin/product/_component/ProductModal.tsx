"use client";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useRef,
  useState,
} from "react";
import styles from "./productModal.module.css";
import { Product, ProductWithCheck } from "@/model/Products";
import { Category } from "@/model/Categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Compressor from "compressorjs";

type Props = {
  // onModalClose: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setProduct: (product: ProductWithCheck[]) => void;
  categoryData: Category[];
};
// 모달안에서만 모달이 닫히겠지
const delay = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

export default function ProductModal({
  // onModalClose,
  isOpen,
  setProduct,
  categoryData,
  setIsOpen,
}: Props) {
  //   const [category, setCategory] = useState("");
  //   const [name, setName] = useState("");
  //   const [price, setPrice] = useState("");
  //   const [description, setDescription] = useState("");
  const [newProductData, setNewProductData] = useState({
    category: {
      id: "",
      name: "",
    },
    image: "",
    name: "",
    price: "",
    description: "",
  });
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // console.log("newProductData.category", newProductData.category);
  const fileRef = useRef<HTMLInputElement>(null);
  const defaultImage =
    "https://iuc.cnu.ac.kr/_custom/cnu/resource/img/tmp_gallery.png";
  // 값을 다 넣고 모달 저장버튼을 눌렀을 때 mutate가 실행되어야하는거임,

  // const formDataRef = useRef(new FormData());
  // 이거 포스팅하기.. ref useState. 리액트 라이프 사이클 관련
  // 레프에 폼 데이터 받아서, 렌더시 다시 그려지지 않게..
  const addProductMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/product`,
        {
          method: "POST",
          body: product,
        }
        // 객채에 담아서 보내줌
      );
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      return response.json();
    },
    onSuccess: (data) => {
      alert("추가성공");
      setNewProductData({
        category: {
          id: "",
          name: "",
        },
        image: "",
        name: "",
        price: "",
        description: "",
      });

      // 이미지 프리뷰도 초기화
      setImagePreview(null);

      queryClient.setQueryData(["admin", "product"], data);
    },
    onError: (error) => {
      console.error(error);
      alert("추가실패");
    },
  });
  console.log("newProductData", newProductData);
  const compressImage = (file: File) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // 이미지 퀄리티 설정
        maxWidth: 800, // 최대 너비 설정
        maxHeight: 800, // 최대 높이 설정
        success: resolve, // 압축한 이미지 저장
        error: (err) => reject(err.message),
      });
    });
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imagePreviewUrl = URL.createObjectURL(file);
      setImagePreview(imagePreviewUrl);

      try {
        // 이미지 압축
        const compressedImage = (await compressImage(file)) as Blob;

        // Base64 인코딩
        const base64Image = (await blobToBase64(compressedImage)) as string;
        // console.log("base64Image", base64Image);
        setNewProductData({
          ...newProductData,
          image: base64Image,
        });
        // 이후에 Base64 인코딩된 이미지 데이터를 FormData에 추가하는 로직을 여기에 구현

        // console.log("base64Image", base64Image);
        // formData.append("image", base64Image);
        // formData.append("image", base64Image);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // if (!formDataRef.current.has("image")) {
    //   console.log("이미지가 추가되지 않았습니다.");
    //   return; // 이미지가 추가되지 않았다면 제출을 중단하고 빠져나감
    // }
    const formData = new FormData();
    formData.append("category", JSON.stringify(newProductData.category));
    formData.append("name", newProductData.name);
    formData.append("price", newProductData.price);
    // formData.append("image", newProductData.image);
    formData.append("description", newProductData.description);
    if (newProductData.image) {
      formData.append("image", newProductData.image);
    }
    if (newProductData.category.id === "") {
      return alert("카테고리를 선택해주세요");
    }
    // console.log("formDataIMG", formData.get("image"));

    addProductMutation.mutate(formData);
  };

  const triggerFileInput = () => {
    if (fileRef.current) {
      console.log("click");
      fileRef.current.click();
      // undefined가 나와서 뭐가 잘못된건줄 알았는데, 그냥 껐다키니까 되네 ..
    }
  };
  const onModalClose = () => {
    setIsOpen(false);
    setImagePreview(null);
    // 모달이 닫히면 프리뷰도 비워줘야하니까,
  };
  const prevDEL = () => {
    setImagePreview(null);
  };
  // console.log("categoryData", categoryData);
  const onChangeHandler: ChangeEventHandler<HTMLSelectElement> = (e) => {
    // const el = e.target.value;

    // const test = categoryData.find((item) => item.id === el);
    // const aa = test?.name;
    // const bb = test?.id;
    // console.log("aa", aa, bb);

    const categoryId = e.target.value; // 카테고리 id 반환
    console.log("categoryId", categoryId);
    const selectedCategory = categoryData.find(
      (category) => category.id === categoryId
    );
    if (selectedCategory) {
      setNewProductData({
        ...newProductData,
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name,
        },
      });
    } else {
      setNewProductData({
        ...newProductData,
        category: {
          id: "",
          name: "",
        },
      });
    }
    //결국 선택해주세요 를 다시 선택할 경우 카테고리를 비워줘야함
  };

  // console.log("categoryData", categoryData);
  // image,category,name,price,description 중 category, image 제외한 나머지는 텍스트로 입력
  // 포스트 시 프로덕트 정보가 담긴 객체를 전달할거고, category는 selectOption으로 전달
  return (
    <>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <p>상품 추가하기</p>
              <button type="button" onClick={onModalClose}>
                ❌
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <fieldset>
                <legend></legend>
                <div>
                  <label htmlFor="image">
                    <div className={styles.imagePrevContainer}>
                      {imagePreview ? (
                        <>
                          <button
                            type="button"
                            onClick={prevDEL}
                            className={styles.prevImgClose}
                          >
                            ❌
                          </button>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className={styles.imagePreview}
                          />
                        </>
                      ) : (
                        <button
                          onClick={triggerFileInput}
                          type="button"
                          className={styles.imageUploadButton}
                        ></button>
                      )}
                    </div>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    name="image"
                    ref={fileRef}
                    className={styles.FileInput}
                    onChange={handleImageChange}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <div>
                    <select
                      name="category"
                      className={styles.selectInput}
                      id="category-select"
                      onChange={onChangeHandler}
                    >
                      <option value="">선택하세요</option>
                      {categoryData?.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                      {/* 로컬에서 클라이언트로 넘겨받고 checked까지 포함된 카테고리 데이터의 name과 id임, 이걸 그냥 상품 데이터에 추가만 해줌 */}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name">상품명</label>
                    <input
                      id="name"
                      type="text"
                      className={styles.textInput}
                      required
                      value={newProductData.name}
                      onChange={(e) => {
                        setNewProductData({
                          ...newProductData,
                          name: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="price">가격</label>
                    <input
                      id="price"
                      type="text"
                      className={styles.textInput}
                      required
                      value={newProductData.price}
                      onChange={(e) => {
                        setNewProductData({
                          ...newProductData,
                          price: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="description">상품 소개</label>
                    <input
                      id="description"
                      type="text"
                      className={styles.textInput}
                      required
                      value={newProductData.description}
                      onChange={(e) => {
                        setNewProductData({
                          ...newProductData,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <button type="submit" className={styles.saveButton}>
                  저장
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// // 이건 수정도 있음 +

// // 모달이 2가지 유형인데, 하나는 추가, 하나는 수정. 이건 기존 카테고리 데이터가 있냐 없냐에 따른거같은데
// // 아 아니면 어차피 추가버튼하고 수정하기 버튼하고 다르니까. 수정하기 버튼은 있는 데이터를 넣어줌.

// // 카테고리
// // 상품이름
// // 가격
// // 상품 소개
