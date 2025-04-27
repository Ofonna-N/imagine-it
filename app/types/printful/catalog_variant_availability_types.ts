// Types for variant availability (v2/catalog-variants/{id}/availability)
export interface PrintfulV2CatalogVariantSellingRegionAvailability {
  name: string;
  availability: string;
  placement_option_availability: { name: string; availability: boolean }[];
}

export interface PrintfulV2CatalogVariantAvailabilityTechnique {
  technique: string;
  selling_regions: PrintfulV2CatalogVariantSellingRegionAvailability[];
}

export interface PrintfulV2CatalogVariantAvailabilityData {
  catalog_variant_id: number;
  techniques: PrintfulV2CatalogVariantAvailabilityTechnique[];
  _links: {
    variant: import("./common_types").PrintfulV2Link;
  };
}

export interface PrintfulV2CatalogVariantAvailabilityFilterSetting {
  name: string;
  value: string;
}

export interface PrintfulV2CatalogVariantAvailabilityResponse {
  data: PrintfulV2CatalogVariantAvailabilityData;
  filter_settings: PrintfulV2CatalogVariantAvailabilityFilterSetting[];
  _links: {
    self: import("./common_types").PrintfulV2Link;
    variant: import("./common_types").PrintfulV2Link;
  };
}
