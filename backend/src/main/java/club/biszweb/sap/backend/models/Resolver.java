package club.biszweb.sap.backend.models;

public interface Resolver {
  void setResolve(boolean resolution);
  
  boolean isResolved();
}
