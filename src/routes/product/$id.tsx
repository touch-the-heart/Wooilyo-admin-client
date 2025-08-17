import { getProductsById } from "@/client";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Eye, EyeOff, Package, Tag } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetailComponent,
});

function ProductDetailComponent() {
  const { id } = Route.useParams();

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductsById({ path: { id: parseInt(id) } }),
    enabled: !!id,
  });

  const product = productData?.data;

  // 카테고리 경로 생성
  const getCategoryPath = (categories: any[]) => {
    if (!categories || categories.length === 0) return "";

    const sortedCategories = [...categories].sort(
      (a, b) => a.category.level - b.category.level
    );
    const categoryNames = sortedCategories.map((cat) => cat.category.name);

    return categoryNames.join(" > ");
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 메인 이미지와 설명 이미지 분류
  const mainImages =
    product?.images
      ?.filter((img) => img.type === "main")
      .sort((a, b) => a.displayOrder - b.displayOrder) || [];
  const descriptionImages =
    product?.images
      ?.filter((img) => img.type === "description")
      .sort((a, b) => a.displayOrder - b.displayOrder) || [];

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            제품을 찾을 수 없습니다
          </h1>
          <Link to="/product">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              제품 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/product">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <Badge variant={product.isVisible ? "default" : "secondary"}>
            {product.isVisible ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                공개
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                비공개
              </>
            )}
          </Badge>
        </div>
        <Link to="/product/edit/$id" params={{ id }}>
          <Button>제품 수정</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 섹션 */}
        <div className="space-y-6">
          {/* 메인 이미지들 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                제품 이미지
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mainImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {mainImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} 이미지 ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(image.url, "_blank")}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">이미지가 없습니다</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상세 설명 이미지들 */}
          {descriptionImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>상세 설명 이미지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {descriptionImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg border"
                    >
                      <img
                        src={image.url}
                        alt={`상세 설명 ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(image.url, "_blank")}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 정보 섹션 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  제품명
                </label>
                <p className="text-lg font-semibold">{product.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  부제목
                </label>
                <p className="text-gray-900">{product.subName || "없음"}</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-700">
                  짧은 설명
                </label>
                <p className="text-gray-900">{product.shortDescription}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  상세 설명
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                카테고리
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.categories && product.categories.length > 0 ? (
                <Badge variant="secondary" className="text-sm">
                  {getCategoryPath(product.categories)}
                </Badge>
              ) : (
                <p className="text-gray-500">카테고리가 설정되지 않았습니다</p>
              )}
            </CardContent>
          </Card>

          {/* 가격 및 사이즈 정보 */}
          {product.details && product.details.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>가격 및 사이즈</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.details.map((detail, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        가격
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {detail.price.toLocaleString()}원
                      </span>
                    </div>
                    {detail.size && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          사이즈
                        </span>
                        <pre className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                          {detail.size}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 메타 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                메타 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  생성일
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  수정일
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(product.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  제품 ID
                </span>
                <span className="text-sm font-mono text-gray-900">
                  #{product.id}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
